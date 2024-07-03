<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="true"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <el-form-item label="地区名称" prop="areaName">
          <el-input v-model="formData.areaName" :maxLength="10"></el-input>
        </el-form-item>
        <!-- 所属地区 -->
        <el-form-item label="所属地区" prop="pId">
          <AreaSelect
            :areaId="formData.pId"
            @change="handleSelectChange"
          ></AreaSelect>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="formData.sort"
            type="number"
            :maxLength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="简要介绍" prop="areaDes">
          <!-- <CoverUpload v-model="formData.iconPath" :type="0"></CoverUpload> -->
          <el-input
            v-model="formData.areaDes"
            type="text"
            :maxLength="50"
          ></el-input>
        </el-form-item>

        <el-form-item label="地区类别" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :label="0">地区</el-radio>
            <el-radio :label="1">城市</el-radio>
            <el-radio :label="2">园区</el-radio>
            <el-radio :label="3">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文章ID" prop="imgUrl">
          <el-radio-group v-model="formData.imgUrl">
            <el-input v-model="formData.imgUrl" :maxLength="50"></el-input>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  saveArea: "/content/saveArea",
};

const props = defineProps({
  treeData: {
    type: Array,
    default: [],
  },
});

// tree 组件的映射关系
const treeProps = {
  class: "cust-tree-item",
  children: "children",
  label: "areaName",
  value: "areaId",
};

const dialogConfig = ref({
  show: false,
  title: "新增栏目",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  areaName: [{ required: true, message: "请输入园区名" }],
  pId: [{ required: true, message: "请选中父级菜单" }],
  type: [{ required: true, message: "请选择类型" }],
  sort: [
    { required: true, message: "请输入排序号" },
    {
      validator: proxy.Verify.number,
      trigger: "blur",
      message: "请输入正确的排序号",
    },
  ],
};

const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (data.areaId == null) {
      dialogConfig.value.title = "新增地区";
      formData.value = { pId: data.areaId };
    } else {
      dialogConfig.value.title = "修改地区";
      formData.value = Object.assign({}, data);
    }
    console.log(treeData.value);
  });
};

defineExpose({
  showEdit,
});

const emit = defineEmits(["reload"]);
const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    let result = await proxy.Request({
      url: api.saveArea,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.value.show = false;
    proxy.Message.success("保存成功!");
    emit("reload");
  });
};

// 地区选择器
const handleSelectChange = (e) => {
  formData.value.pId = e[e.length - 1];
};
</script>

<style lang="scss" scoped>
.check-span-item {
  float: left;
  margin-right: 10px;
  line-height: 20px;
}
</style>
