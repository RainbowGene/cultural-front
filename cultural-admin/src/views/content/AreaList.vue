<template>
  <div>
    <div class="top-panel">
      <el-card class="box-card">
        <el-form :model="searchForm" label-width="70px" label-position="right">
          <el-row>
            <!-- <el-col :span="7">
              <el-form-item label="园区名">
                <el-input
                  clearable
                  placeholder="支持模糊搜索"
                  v-model.trim="searchForm.areaNameFuzzy"
                  @keyup.enter.native="loadDataList"
                  class="password-input"
                ></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="6" :style="{ paddingLeft: '10px' }">
              <!-- <el-button type="success" @click="loadDataList()">查询</el-button> -->
              <el-button
                type="primary"
                @click="showEdit()"
                v-has="proxy.PermissionCode.area.edit"
                >新增园区</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <el-card class="table-data-card">
      <template #header>
        <span>园区列表</span>
      </template>
      <Table
        ref="tableInfoRef"
        :columns="areas"
        :fetch="loadDataList"
        :dataSource="tableData"
        :options="tableOptions"
        :extHeight="tableOptions.extHeight"
        rowKey="areaId"
      >
        <template #slotOperation="{ index, row }">
          <div class="row-op-panel">
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="showEdit(row)"
              v-has="proxy.PermissionCode.area.edit"
              >修改</a
            >
            <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="delArea(row)"
              v-has="proxy.PermissionCode.area.del"
              >删除</a
            >
          </div>
        </template>
      </Table>
    </el-card>
    <!-- 新增/修改 -->
    <AreaEdit
      ref="areaEditRef"
      @reload="loadDataList"
    ></AreaEdit>
  </div>
</template>

<script setup>
import AreaEdit from "./AreaEdit.vue";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  areaList: "/content/areaList",
  savearea: "/content/saveArea",
  delarea: "/content/delArea",
};

const searchForm = ref({});
const tableData = ref({ list: [] });
const tableOptions = ref({
  extHeight: 125,
});

const areas = [
  {
    label: "ID",
    prop: "areaId",
    width: 80,
  },
  { label: "园区名", prop: "areaName" },
  {
    label: "操作",
    prop: "type",
    width: 200,
    scopedSlots: "slotOperation",
  },
];

const tableInfoRef = ref();
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(params, searchForm.value);
  let result = await proxy.Request({
    url: api.areaList,
    params,
  });
  if (!result) {
    return;
  }
  // Object.assign(tableData.value, result.data);
  tableData.value.list = result.data;
};

// 删除栏目
const delArea = (data) => {
  proxy.Confirm(`确定要删除${data.areaName}吗？`, async () => {
    let result = await proxy.Request({
      url: api.delarea,
      params: {
        areaId: data.areaId,
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("删除成功!");
    loadDataList();
  });
};

const areaEditRef = ref();
const showEdit = (data = {}) => {
  areaEditRef.value.showEdit(Object.assign({}, data));
};
</script>

<style lang="scss" scoped>
.detail-tree-panel {
  height: calc(100vh - 273px);
  overflow: auto;
  width: 100%;
}

.right-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 18px;
}

.text-red {
  color: red;
  cursor: pointer;
}
.text-green {
  color: green;
  cursor: pointer;
}
</style>
